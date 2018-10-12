Triangle3D = function (pv0, pv1, pv2) {
    this.v0 = pv0;
    this.v1 = pv1;
    this.v2 = pv2;

    this.process = function (pcamera, worldTransform) {

        // to world space
        this.v0_w = transformPoint(worldTransform, this.v0);
        this.v1_w = transformPoint(worldTransform, this.v1);
        this.v2_w = transformPoint(worldTransform, this.v2);

        // to camera space
        this.v0_c = pcamera.toCameraSpace(this.v0_w);
        this.v1_c = pcamera.toCameraSpace(this.v1_w);
        this.v2_c = pcamera.toCameraSpace(this.v2_w);

        //back face culling
        var v01 = VectorMinus(this.v1_c, this.v0_c);
        var v02 = VectorMinus(this.v2_c, this.v0_c);
        var normal = CrossProduct(v02, v01);
        normal.normalize();

        var center = this.v0_c.add(this.v1_c).add(this.v2_c).multiply(1 / 3);
        var center_to_eye = VectorMinus(new Vector3D(0, 0, 0), center);
        center_to_eye.normalize();
        var cos_value = DotProduct(normal, center_to_eye);;
        if (cos_value <= 0) {
            this.v_s = new Array();
            return;
        }

        //do only nearPlane clip
        var nearPlaneZ = pcamera.nearPlaneZ;
        var v_clip = clip(this, nearPlaneZ);

        // to screen space
        this.v_s = new Array();
        for (var i = 0; i < v_clip.length; ++i)
            this.v_s[i] = pcamera.toScreenSpace(v_clip[i]);
    }

    this.draw = function (ctx) {
        var tCount = this.v_s.length / 3;
        for (var c = 1; c <= tCount; ++c) {
            var index = 3 * c - 1;
            ctx.moveTo(this.v_s[index].x, this.v_s[index].y);
            ctx.lineTo(this.v_s[index - 2].x, this.v_s[index - 2].y);
            ctx.lineTo(this.v_s[index - 1].x, this.v_s[index - 1].y);
            ctx.lineTo(this.v_s[index].x, this.v_s[index].y);
        }
    }

}

function clip(triangle, nearPlaneZ, isPositive) {

    var v_clip = new Array();

    var getCrossPoint = function (pv0, pv1, pz) {
        var t = (pz - pv0.z) / (pv1.z - pv0.z);
        var x = pv0.x + t * (pv1.x - pv0.x);
        var y = pv0.y + t * (pv1.y - pv0.y);
        return new Vector3D(x, y, pz);
    }

    //pvo in 
    var clip_first_in = function (pv0, pv1, pv2) {
        // 1 triangle 1 one triangle
        v_clip[0] = pv0;
        v_clip[1] = getCrossPoint(pv0, pv1, nearPlaneZ);
        v_clip[2] = getCrossPoint(pv0, pv2, nearPlaneZ);
    }

    //pvo out
    var clip_first_out = function (pv0, pv1, pv2) {

        // 1 triangle to 2 triangle
        var cross1 = getCrossPoint(pv2, pv0, nearPlaneZ);
        var cross2 = getCrossPoint(pv0, pv1, nearPlaneZ);

        v_clip[0] = pv2;
        v_clip[1] = cross1;
        v_clip[2] = cross2;

        v_clip[3] = pv2;
        v_clip[4] = cross2;
        v_clip[5] = pv1;
    }


    // 有8種情況

    if (triangle.v0_c.z > nearPlaneZ)//out
    {
        if (triangle.v1_c.z > nearPlaneZ) //out out
        {
            if (triangle.v2_c.z > nearPlaneZ)//full out of nearPlaneZ (no clip)
                ;
            else //out out in
                clip_first_in(triangle.v2_c, triangle.v0_c, triangle.v1_c);
        }
        else //out in 
        {
            if (triangle.v2_c.z > nearPlaneZ)//out in out
                clip_first_in(triangle.v1_c, triangle.v2_c, triangle.v0_c);
            else // out in in
                clip_first_out(triangle.v0_c, triangle.v1_c, triangle.v2_c);
        }
    }
    else // in
    {
        if (triangle.v1_c.z > nearPlaneZ)// in out 
        {
            if (triangle.v2_c.z > nearPlaneZ)// in out out
                clip_first_in(triangle.v0_c, triangle.v1_c, triangle.v2_c);
            else // in out in
                clip_first_out(triangle.v1_c, triangle.v2_c, triangle.v0_c);
        }
        else // in in
        {
            if (triangle.v2_c.z > nearPlaneZ)// in in out
                clip_first_out(triangle.v2_c, triangle.v0_c, triangle.v1_c);
            else // in in in (no clip)
            {
                v_clip[0] = triangle.v0_c;
                v_clip[1] = triangle.v1_c;
                v_clip[2] = triangle.v2_c;
            }
        }
    }

    return v_clip;
}