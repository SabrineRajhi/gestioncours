package GestionCours.backend.springboot.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.User;
import GestionCours.backend.springboot.Exception.accountNotFoundException;
import GestionCours.backend.springboot.Repositrory.UserRepository;


@Service
public class UserServiceImpl implements UserService {
    private final UserRepository  userRepository;
    private  PasswordEncoder passwordEncoder;
    @Autowired
    public UserServiceImpl(UserRepository userRepository,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new accountNotFoundException("Utilisateur avec ID " + id + " non trouvé."));
    }

    @Override
    public User addUser(User user) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        //user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new accountNotFoundException("Utilisateur avec ID " + id + " non trouvé."));
        user.setNom(userDetails.getNom());
        user.setPrenom(userDetails.getPrenom());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(userDetails.getPassword());
            user.setPassword(encodedPassword);
        }
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new accountNotFoundException("Utilisateur avec ID " + id + " non trouvé.");
        }
        userRepository.deleteById(id);
    }

    @Override
    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new accountNotFoundException("Utilisateur avec email " + email + " non trouvé.");
        }
        return user;
    }
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}