package GestionCours.backend.springboot.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import GestionCours.backend.springboot.Entity.Element;
import GestionCours.backend.springboot.Entity.TypeElement;
import GestionCours.backend.springboot.Repositrory.ElementRepository;
import GestionCours.backend.springboot.Repositrory.EspaceCoursRepository;
import GestionCours.backend.springboot.Repositrory.TypeElementRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/element")
public class TelechargerFichierController {

    private static final Logger log = LoggerFactory.getLogger(TelechargerFichierController.class);
    private static final String UPLOAD_DIR = "uploads/elements/";

    @Autowired
    private ElementRepository elementRepository;
    @Autowired
    private TypeElementRepository typeElementRepository;
    @Autowired
    private  EspaceCoursRepository   espaceCoursRepository;
    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        log.info("Upload directory initialized at: {}", UPLOAD_DIR);
    }

    @PostMapping("/{elementId}/upload")
    public ResponseEntity<String> uploadFile(@PathVariable Long elementId, @RequestParam("file") MultipartFile file) throws IOException {
        Optional<Element> elementOptional = elementRepository.findById(elementId);
        if (elementOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Element not found");
        }

        if (file.isEmpty()) {
            return ResponseEntity.status(400).body("File is empty");
        }

        String originalFileName = file.getOriginalFilename().replaceAll("\\s+", "_");
        String fileName = "elt_" + elementId + "_" + System.currentTimeMillis() + "_" + originalFileName;
        
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);


        Element element = elementOptional.get();
        element.setCheminElt("/" + UPLOAD_DIR + fileName);
        elementRepository.save(element);

        return ResponseEntity.ok("File uploaded successfully: " + fileName);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam("filename") String fileName) throws MalformedURLException {
        Path filePath = Paths.get(UPLOAD_DIR + fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.status(404).body(null);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }
    
    
    
    @PostMapping("upload")
    public ResponseEntity<?> addElementWithFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("desElt") String desElt,
            @RequestParam("typeElementId") Long typeElementId) {

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Le fichier est vide.");
            }

            Optional<TypeElement> optionalTypeElement = typeElementRepository.findById(typeElementId);
            if (optionalTypeElement.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("TypeElement non trouvé.");
            }
            
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            String originalFileName = file.getOriginalFilename().replaceAll("\\s+", "_");
            String fileName = System.currentTimeMillis() + "_" + originalFileName;
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Element element = new Element();
            element.setDesElt(desElt);
            element.setCheminElt("/" + UPLOAD_DIR + fileName);
            element.setTypeElement(optionalTypeElement.get());

            elementRepository.save(element);

            return ResponseEntity.ok("Élément ajouté avec succès.");

        } catch (IOException e) {
            log.error("File upload error: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Erreur lors du téléchargement du fichier: " + e.getMessage());
        } catch (DataAccessException e) {
            log.error("Database error occurred: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Erreur de base de données: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Erreur inattendue: " + e.getMessage());
        }
    }
    
    /*
    

    @PostMapping("upload")
    public ResponseEntity<?> addElementWithFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("desElt") String desElt,
            @RequestParam("typeElementId") Long typeElementId) {

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Le fichier est vide.");
            }

            Optional<TypeElement> optionalTypeElement = typeElementRepository.findById(typeElementId);
            if (optionalTypeElement.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("TypeElement non trouvé.");
            }
            
            // Créer le répertoire de stockage s'il n'existe pas
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            String originalFileName = file.getOriginalFilename().replaceAll("\\s+", "_");
            String fileName = System.currentTimeMillis() + "_" + originalFileName;
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Element element = new Element();
            element.setDesElt(desElt);
            element.setCheminElt("/" + UPLOAD_DIR + fileName);
            element.setTypeElement(optionalTypeElement.get());

            elementRepository.save(element);

            return ResponseEntity.ok("Élément ajouté avec succès.");
            
            
            
        } catch (IOException e) {
            e.printStackTrace(); // Log l'erreur
            return ResponseEntity.internalServerError().body("Erreur lors du téléchargement du fichier: " + e.getMessage());
        } catch (DataAccessException e) {
            e.printStackTrace(); // Log les erreurs de base de données
            return ResponseEntity.internalServerError().body("Erreur de base de données: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // Log toutes autres erreurs
            return ResponseEntity.internalServerError().body("Erreur inattendue: " + e.getMessage());
        }

/*
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erreur lors du téléchargement du fichier.");
        }
            
            
    }
    */
        
    
    
    
    
    
    
        
        @DeleteMapping("/delete/{id}")
        public ResponseEntity<?> deleteElement(@PathVariable Long id) {
            Optional<Element> optionalElement = elementRepository.findById(id);

            if (optionalElement.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Élément non trouvé.");
            }

            Element element = optionalElement.get();
            String cheminFichier = element.getCheminElt();

            try {
                // Supprimer le fichier du système
                Path chemin = Paths.get(cheminFichier.replaceFirst("/", "")); // enlever le '/' initial si présent
                Files.deleteIfExists(chemin);

                // Supprimer l’élément en base de données
                elementRepository.deleteById(id);

                return ResponseEntity.ok("Élément supprimé avec succès.");
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                     .body("Erreur lors de la suppression du fichier.");
            }
        }

    }




