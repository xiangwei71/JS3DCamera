Plane3D = function (pPoint, pNormal) {
    this.point = point;
    this.normal = pNormal;

    this.isPositive = function (testPoint) {
        var cosValue = CrossProduct(testPoint.minus(this.point), this.normal);
        return cos_value > 0
    }
}