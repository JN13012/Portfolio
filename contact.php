<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Récupération des données du formulaire
    $prenom = htmlspecialchars($_POST['prenom']);
    $nom = htmlspecialchars($_POST['nom']);
    $email = htmlspecialchars($_POST['email']);
    $tel = htmlspecialchars($_POST['tel']);
    $message = htmlspecialchars($_POST['message']);

    // Destinataire
    $to = "jeremie.nagi@epitec.eu";
    $subject = "Nouveau message de $prenom $nom";

    // Corps du mail
    $body = "Nom: $nom\nPrénom: $prenom\nEmail: $email\nTéléphone: $tel\n\nMessage:\n$message";

    // En-têtes du mail
    $headers = "From: $email" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // Envoi du mail
    if (mail($to, $subject, $body, $headers)) {
        echo "Message envoyé avec succès !";
    } else {
        echo "Erreur lors de l'envoi du message.";
    }
}
?>
