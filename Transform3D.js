Transform3D = function (xAxis, yAxis, zAxis, position) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.zAxis = zAxis;
    this.position = position;
}

function transformPoint(transform, point) {
    var vectorX = transform.xAxis.multiply(point.x);
    var vectorY = transform.yAxis.multiply(point.y);
    var vectorZ = transform.zAxis.multiply(point.z);

    return transform.position.add(vectorX).add(vectorY).add(vectorZ);
}

function transformVector(transform, vertex) {
    var vectorX = transform.xAxis.multiply(vertex.x);
    var vectorY = transform.yAxis.multiply(vertex.y);
    var vectorZ = transform.zAxis.multiply(vertex.z);

    return vectorX.add(vectorY).add(vectorZ);
}

function transformTransform(transform, inputTransform) {
    return new Transform3D(
        transformVector(transform, inputTransform.xAxis),
        transformVector(transform, inputTransform.yAxis),
        transformVector(transform, inputTransform.zAxis),
        transformPoint(transform, inputTransform.position),
    );
}

function rotateByZ(degree) {
    var radian = degreeToRad(degree);
    var c = Math.cos(radian), s = Math.sin(radian);
    var xAxis = new Vector3D(c, s, 0);
    var zAxis = new Vector3D(0, 0, 1);

    // yAxis不需要normalize
    var yAxis = CrossProduct(zAxis, xAxis); // TODO:這可以預先算出來

    return new Transform3D(
        xAxis,
        yAxis,
        zAxis,
        new Vector3D(0, 0, 0),
    );
}

function offset(x, y, z) {
    return new Transform3D(
        new Vector3D(1, 0, 0),
        new Vector3D(0, 1, 0),
        new Vector3D(0, 0, 1),
        new Vector3D(x, y, z),
    );
}