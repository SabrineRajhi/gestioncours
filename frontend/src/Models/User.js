class User {
    // Enum pour les rôles
    static Role = {
      ETUDIANT: 'ETUDIANT',
      ENSEIGNANT: 'ENSEIGNANT',
      ADMIN: 'ADMIN'
    };
  
    constructor(id, email, password, role) {
      this.id = id;
      this.email = email;
      this.password = password;
      this.role = role;  // Le rôle doit être un des rôles définis dans User.Role
    }
  
    // Getters
    getId() {
      return this.id;
    }
  
    getEmail() {
      return this.email;
    }
  
    getPassword() {
      return this.password;
    }
  
    getRole() {
      return this.role;
    }
  
    // Setters
    setId(id) {
      this.id = id;
    }
  
    setEmail(email) {
      this.email = email;
    }
  
    setPassword(password) {
      this.password = password;
    }
  
    setRole(role) {
      if (Object.values(User.Role).includes(role)) {
        this.role = role;
      } else {
        throw new Error("Role invalide");
      }
    }
  
    // Affichage sous forme de chaîne
    toString() {
      return `User {id: ${this.id}, email: ${this.email}, role: ${this.role}}`;
    }
  }
  
  // Exemple d'utilisation :
  const user1 = new User(1, 'etudiant@example.com', 'motdepasse123', User.Role.ETUDIANT);
  console.log(user1.toString());  // Affiche : User {id: 1, email: etudiant@example.com, role: ETUDIANT}
  
  const user2 = new User(2, 'enseignant@example.com', 'password456', User.Role.ENSEIGNANT);
  console.log(user2.toString());  // Affiche : User {id: 2, email: enseignant@example.com, role: ENSEIGNANT}
  