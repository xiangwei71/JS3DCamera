Camera3D = function (peye, ppitch, pyaw, fov) {
    this.eye = peye;

    this.yaw = degreeToRad(pyaw);
    this.pitch = degreeToRad(ppitch);
    this.fov = degreeToRad(fov);
    this.ratewh = 1;//1:1
    this.nearPlaneZ = -1;
    this.farPlaneZ = -50;
    this.corners = new Array();

    this.moveEye = function (s, A) {
        this.eye = VectorAdd(this.eye, A.multiply(s));
    }

    this.addPitch = function (k) {
        this.pitch = this.pitch + k;
        if (this.pitch < 0.1) this.pitch = 0.1;
        if (this.pitch > Math.PI) this.pitch = Math.PI;
    }

    this.addYaw = function (k) {
        this.yaw = this.yaw + k;
        var max = 2 * Math.PI;
        if (this.yaw < 0) this.yaw = this.yaw + max;
        if (this.yaw > max) this.yaw = this.yaw - max;
    }

    this.reset = function () {
        //這裡是用右手座標來思考

        //get axis_z
        var z = Math.cos(this.pitch);
        var x = Math.sin(this.pitch) * Math.cos(this.yaw);
        var y = Math.sin(this.pitch) * Math.sin(this.yaw);
        this.axis_z = new Vector3D(x, y, z);

        var helpV = new Vector3D(0, 0, 1);
        this.axis_x = CrossProduct(helpV, this.axis_z);
        this.axis_x.normalize();
        this.axis_y = CrossProduct(this.axis_z, this.axis_x);
        this.axis_y.normalize();

        this.screenCenterX = 300
        this.screenCenterY = 300;

        this.halfW = 300;
        this.halfH = 300;

        this.updateCorner();
    }

    this.updateCorner = function () {
        var halfFov = 0.5 * this.fov;
        var k = Math.tan(halfFov);

        var x = [-1, 1];
        var y = [-1, 1];
        var z = [this.nearPlaneZ, this.farPlaneZ];
        var index = 0;
        for (var c = 0; c < z.length; ++c) {
            for (var b = 0; b < y.length; ++b) {
                for (var a = 0; a < x.length; ++a) {
                    var move = z[c] * k;
                    var temp = VectorAdd(this.eye, this.axis_z.multiply(z[c]));
                    temp = VectorAdd(temp, this.axis_y.multiply(move * y[b]));
                    temp = VectorAdd(temp, this.axis_x.multiply(move * x[a]));
                    this.corners[index] = temp;

                    //alert(this.corners[index].toString());
                    ++index;
                }
            }
        }
    }

    this.toCameraSpace = function (A) {
        var diff = A.minus(this.eye);
        var point_in_camera_space = new Vector3D(DotProduct(diff, this.axis_x), DotProduct(diff, this.axis_y), DotProduct(diff, this.axis_z));
        return point_in_camera_space;
    }

    this.toScreenSpace = function (A) {
        var z = -A.z;
        var halfFov = 0.5 * this.fov;
        var divide = z * Math.tan(halfFov);

        var NDCx = A.x / divide;
        var NDCy = (-A.y) / divide;

        var x = this.halfW * NDCx + this.screenCenterX;
        var y = this.halfH * NDCy + this.screenCenterY;

        var temp = new Vector3D(x, y, z);
        //alert(temp.toString());
        return temp;
    }

    //檢查直的2個點是否都落在合法的Camera位置
    this.checkIsValidLine = function (v1, v2) {
        return test = v1.z > 1 && v2.z > 1;
    }

    this.drawLine = function (pctx, v1, v2) {
        pctx.moveTo(v1.x, v1.y);
        pctx.lineTo(v2.x, v2.y);
    }

    this.draw = function (pcamera, pctx) {
        //trandform
        var corners_c = new Array();
        var corners_s = new Array();
        for (var i = 0; i < 8; ++i) {
            corners_c[i] = pcamera.toCameraSpace(this.corners[i]);
            corners_s[i] = pcamera.toScreenSpace(corners_c[i]);
        }

        var eye_c = pcamera.toCameraSpace(this.eye);
        var eye_s = pcamera.toScreenSpace(eye_c);

        //draw view frustum
        pctx.strokeStyle = 'rgba(0,0,255,1)';
        pctx.beginPath();
        if (this.checkIsValidLine(corners_s[0], corners_s[2])) this.drawLine(pctx, corners_s[0], corners_s[2]);
        if (this.checkIsValidLine(corners_s[2], corners_s[3])) this.drawLine(pctx, corners_s[2], corners_s[3]);
        if (this.checkIsValidLine(corners_s[3], corners_s[1])) this.drawLine(pctx, corners_s[3], corners_s[1]);
        if (this.checkIsValidLine(corners_s[1], corners_s[0])) this.drawLine(pctx, corners_s[1], corners_s[0]);

        if (this.checkIsValidLine(corners_s[4], corners_s[6])) this.drawLine(pctx, corners_s[4], corners_s[6]);
        if (this.checkIsValidLine(corners_s[6], corners_s[7])) this.drawLine(pctx, corners_s[6], corners_s[7]);
        if (this.checkIsValidLine(corners_s[7], corners_s[5])) this.drawLine(pctx, corners_s[7], corners_s[5]);
        if (this.checkIsValidLine(corners_s[5], corners_s[4])) this.drawLine(pctx, corners_s[5], corners_s[4]);
        pctx.stroke();

        // draw green line
        pctx.strokeStyle = 'rgba(0,255,0,1)';
        pctx.beginPath();
        for (var i = 4; i <= 7; ++i) {
            if (this.checkIsValidLine(corners_s[i], eye_s)) this.drawLine(pctx, corners_s[i], eye_s);;
        }
        pctx.stroke();

        if (eye_s.z > 0) {
            // draw eye
            pctx.beginPath();
            pctx.arc(eye_s.x, eye_s.y, 5, 0, 2 * Math.PI, false);

            pctx.fillStyle = 'rgba(255,255,0,1)';
            pctx.fill();
            pctx.lineWidth = 1;
            pctx.strokeStyle = 'rgba(0,0,255,1)';
            pctx.stroke();
        }

    }
}