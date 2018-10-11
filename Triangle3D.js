Triangle3D = function (pv0, pv1, pv2) {
    this.v0 = pv0;
    this.v1 = pv1;
    this.v2 = pv2;

    //pvo in 
    this.clip_first_in = function (pv0, pv1, pv2) {
        //dump("clip_first_in<br/>");
        // one triangle to one triangle
        this.v_clip[0] = pv0;
        this.v_clip[1] = this.getCrossPoint(pv0, pv1, this.nearPlaneZ);
        this.v_clip[2] = this.getCrossPoint(pv0, pv2, this.nearPlaneZ);
    }

    //pvo out
    this.clip_first_out = function (pv0, pv1, pv2) {
        //dump("clip_first_out<br/>");

        // one triangle to two triangle
        var cross1 = this.getCrossPoint(pv2, pv0, this.nearPlaneZ);
        var cross2 = this.getCrossPoint(pv0, pv1, this.nearPlaneZ);

        this.v_clip[0] = pv2;
        this.v_clip[1] = cross1;
        this.v_clip[2] = cross2;

        this.v_clip[3] = pv2;
        this.v_clip[4] = cross2;
        this.v_clip[5] = pv1;
    }

    this.getCrossPoint = function (pv0, pv1, pz) {
        var t = (pz - pv0.z) / (pv1.z - pv0.z);
        var x = pv0.x + t * (pv1.x - pv0.x);
        var y = pv0.y + t * (pv1.y - pv0.y);
        return new Vector3D(x, y, pz);
    }

    this.process = function (pcamera, worldTransform) {

        // to world space
        this.v0_w = transformPoint(worldTransform, this.v0);
        this.v1_w = transformPoint(worldTransform, this.v1);
        this.v2_w = transformPoint(worldTransform, this.v2);

        // to camera space
        this.v0_c = pcamera.toCameraSpace(this.v0_w);
        this.v1_c = pcamera.toCameraSpace(this.v1_w);
        this.v2_c = pcamera.toCameraSpace(this.v2_w);

        //do only nearPlane clip
        this.v_clip = new Array();

        //back face culling
        var v01 = VectorMinus(this.v1_c, this.v0_c);
        var v02 = VectorMinus(this.v2_c, this.v0_c);
        var normal = CrossProduct(v02, v01);
        normal.normalize();

        var center = this.v0_c.add(this.v1_c).add(this.v2_c).multiply(1 / 3);
        var center_to_eye = VectorMinus(new Vector3D(0, 0, 0), center);
        center_to_eye.normalize();
        var cos_value = DotProduct(normal, center_to_eye);
        //alert(cos_value);
        if (cos_value <= 0) {
            this.v_s = new Array();
            return;
        }

        //do only nearPlane clip
        var pz = pcamera.nearPlaneZ;
        this.nearPlaneZ = pcamera.nearPlaneZ;
        if (this.v0_c.z > pz)//out
        {
            if (this.v1_c.z > pz) //out out
            {
                if (this.v2_c.z > pz)//full out of nearPlaneZ
                    ;
                else //out out in
                    this.clip_first_in(this.v2_c, this.v0_c, this.v1_c);
            }
            else //out in 
            {
                if (this.v2_c.z > pz)//out in out
                    this.clip_first_in(this.v1_c, this.v2_c, this.v0_c);
                else // out in in
                    this.clip_first_out(this.v0_c, this.v1_c, this.v2_c);
            }
        }
        else // in
        {
            if (this.v1_c.z > pz)// in out 
            {
                if (this.v2_c.z > pz)// in out out
                    this.clip_first_in(this.v0_c, this.v1_c, this.v2_c);
                else // in out in
                    this.clip_first_out(this.v1_c, this.v2_c, this.v0_c);
            }
            else // in in
            {
                if (this.v2_c.z > pz)// in in out
                    this.clip_first_out(this.v2_c, this.v0_c, this.v1_c);
                else // no clip
                {
                    this.v_clip[0] = this.v0_c;
                    this.v_clip[1] = this.v1_c;
                    this.v_clip[2] = this.v2_c;
                }
            }
        }

        //for(var i=0;i<this.v_clip.length;++i)
        // dump(this.v_clip[i].toString()+"<br />");

        // to screen space
        this.v_s = new Array();
        for (var i = 0; i < this.v_clip.length; ++i)
            this.v_s[i] = pcamera.toScreenSpace(this.v_clip[i]);
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