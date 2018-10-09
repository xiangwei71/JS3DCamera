Box3D = function () {
    // 建立正方體頂點資料
    var triangles = new Array();

    triangles.push(new Triangle3D(new Vector3D(-10, -10, -10), new Vector3D(10, -10, 10), new Vector3D(10, -10, -10)));
    triangles.push(new Triangle3D(new Vector3D(-10, -10, -10), new Vector3D(-10, -10, 10), new Vector3D(10, -10, 10)));

    triangles.push(new Triangle3D(new Vector3D(-10, 10, -10), new Vector3D(10, 10, -10), new Vector3D(10, 10, 10)));
    triangles.push(new Triangle3D(new Vector3D(-10, 10, -10), new Vector3D(10, 10, 10), new Vector3D(-10, 10, 10)));

    triangles.push(new Triangle3D(new Vector3D(-10, -10, 10), new Vector3D(10, 10, 10), new Vector3D(10, -10, 10)));
    triangles.push(new Triangle3D(new Vector3D(-10, -10, 10), new Vector3D(-10, 10, 10), new Vector3D(10, 10, 10)));

    triangles.push(new Triangle3D(new Vector3D(-10, -10, -10), new Vector3D(10, -10, -10), new Vector3D(10, 10, -10)));
    triangles.push(new Triangle3D(new Vector3D(-10, -10, -10), new Vector3D(10, 10, -10), new Vector3D(-10, 10, -10)));

    triangles.push(new Triangle3D(new Vector3D(-10, -10, 10), new Vector3D(-10, -10, -10), new Vector3D(-10, 10, -10)));
    triangles.push(new Triangle3D(new Vector3D(-10, -10, 10), new Vector3D(-10, 10, -10), new Vector3D(-10, 10, 10)));

    triangles.push(new Triangle3D(new Vector3D(10, -10, -10), new Vector3D(10, -10, 10), new Vector3D(10, 10, 10)));
    triangles.push(new Triangle3D(new Vector3D(10, -10, -10), new Vector3D(10, 10, 10), new Vector3D(10, 10, -10)));
    this.triangles = triangles;

    this.update = function (camera, worldTransform) {
        // 處理正方體的變換
        for (var i = 0; i < triangles.length; ++i) {
            triangles[i].process(nowViewCamera, worldTransform);
        }
    }

    this.draw = function (ctx) {
        // 畫三角形
        ctx.globalCompositeOperation = 'destination-over';

        ctx.strokeStyle = 'rgba(255,0,0,1)';

        ctx.beginPath();

        for (var i = 0; i < triangles.length; ++i) {
            triangles[i].draw(ctx);
        }

        ctx.stroke();
    }
};