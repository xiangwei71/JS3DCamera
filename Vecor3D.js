function VectorAdd(A, B) {
    var temp = new Vector3D(B.x + A.x, B.y + A.y, B.z + A.z);
    return temp
}

function VectorMinus(A, B) {
    var temp = new Vector3D(A.x - B.x, A.y - B.y, A.z - B.z);
    return temp
}

function VectorMultiply(A, s) {
    var temp = new Vector3D(A.x * s, A.y * s, A.z * s);
    return temp
}

function CrossProduct(A, B) {
    var temp = new Vector3D(A.y * B.z - A.z * B.y, -A.x * B.z + A.z * B.x, A.x * B.y - A.y * B.x);
    return temp;
}

function DotProduct(A, B) {
    return A.x * B.x + A.y * B.y + A.z * B.z;
}

Vector3D = function (px, py, pz) {
    this.x = px;
    this.y = py;
    this.z = pz;

    this.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    this.normalize = function () {
        var temp = this.length();
        this.x = this.x / temp;
        this.y = this.y / temp;
        this.z = this.z / temp;
    }

    this.add = function (A) {
        var temp = new Vector3D(this.x + A.x, this.y + A.y, this.z + A.z);
        return temp
    }

    this.minus = function (A) {
        var temp = new Vector3D(this.x - A.x, this.y - A.y, this.z - A.z);
        return temp
    }

    this.multiply = function (s) {
        var temp = new Vector3D(this.x * s, this.y * s, this.z * s);
        return temp
    }

    this.toString = function () {
        return "( " + this.x + " , " + this.y + " , " + this.z + " )";
    }
}