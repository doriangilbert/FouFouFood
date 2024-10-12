class User {
    constructor(id, name, email, password, phone, address, isAdmin, orders) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.isAdmin = isAdmin;
        this.orders = orders;
    }
}

module.exports = User;