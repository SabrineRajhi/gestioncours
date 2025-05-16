package GestionCours.backend.springboot.Controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.security.auth.login.AccountNotFoundException;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import GestionCours.backend.springboot.Entity.User;
import GestionCours.backend.springboot.Services.UserService;
import GestionCours.backend.springboot.Exception.UserNotFoundException;
import GestionCours.backend.springboot.Exception.accountNotFoundException;

@RestController
@RequestMapping("/users")
public class Usercontrollers {

    @Autowired
    private UserService userService;

    // Récupérer tous les utilisateurs (réservé aux admins)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Ajouter un utilisateur (accessible à tous pour l'inscription)
    @PostMapping("/add")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        // Vérifier si l'email existe déjà
        if (userService.getUserByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }
        User savedUser = userService.addUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // Mettre à jour un utilisateur (réservé aux admins ou à l'utilisateur concerné)
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Validated @RequestBody User user) throws AccountNotFoundException {
        User updatedUser = userService.updateUser(id, user);
		return ResponseEntity.ok(updatedUser);
    }

    // Supprimer un utilisateur (réservé aux admins)
   // @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Utilisateur supprimé avec succès !");
        } catch (accountNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
    // Find user by email
    @GetMapping("/findByEmail/{email}")
    public ResponseEntity<User> findByEmail(@PathVariable String email) {
        User user = userService.findByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Récupérer un utilisateur par ID (réservé aux admins ou à l'utilisateur concerné)
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
    
    
    
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, String>>> getAll() {
        List<User> utilisateurs = userService.getAllUsers();
        List<Map<String, String>> userList = utilisateurs.stream()
                .map(u -> Map.of(
                    "password", u.getPassword(),
                    "role", u.getRole().name().toLowerCase(),
                    "email", u.getEmail().split("@")[0]
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userList);
    }
}