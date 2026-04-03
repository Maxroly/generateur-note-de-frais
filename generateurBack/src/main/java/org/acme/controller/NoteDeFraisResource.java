package org.acme.controller;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

import java.util.Base64;
import java.util.concurrent.CompletableFuture;

import org.acme.dto.NoteDeFraisDTO;
import org.acme.entity.NoteDeFrais;
import org.acme.entity.User;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;

@Path("/api/notes")
public class NoteDeFraisResource {
    @Inject
    Mailer mailer;

    @POST
    @Transactional
    public String traiterNoteDeFrais(NoteDeFraisDTO donnees) {

        User user = User.find("mail", donnees.mail).firstResult();
        if (user == null) {
            user = new User();
            user.nom = donnees.nom;
            user.mail = donnees.mail;
            user.persist();
        }

        NoteDeFrais nouvelleDemande = new NoteDeFrais();
        nouvelleDemande.raison = donnees.raison;
        nouvelleDemande.budget = donnees.budget;
        nouvelleDemande.montant = donnees.montant;
        nouvelleDemande.dateDemande = donnees.dateDemande;
        nouvelleDemande.pdfBase64 = donnees.pdfBase64;
        nouvelleDemande.user = user;
        nouvelleDemande.typeDeFrais = donnees.typeDeFrais;
        nouvelleDemande.iban = donnees.iban;
        nouvelleDemande.bic = donnees.bic;

        nouvelleDemande.persist();

        if (donnees.envoyerMail == true) {
            String mailDestinataire = donnees.mail;
            String nomDestinataire = donnees.nom;
            String pdfBase64 = donnees.pdfBase64;
            String typeDeFrais = donnees.typeDeFrais;
            float montant = donnees.montant;
            String raison = donnees.raison;

            CompletableFuture.runAsync(() -> {
                try {
                    String pdfDecoded = pdfBase64.substring(pdfBase64.indexOf(",") + 1);
                    byte[] pdfByte = Base64.getDecoder().decode(pdfDecoded);

                    if ("Remboursement".equals(typeDeFrais)) {
                        mailer.send(
                                Mail.withText(mailDestinataire,
                                        "Demande de note de frais",
                                        "Bonjour " + nomDestinataire
                                                + ",\n\nVoici ci joint votre note de frais d'un montant de "
                                                + montant + " € concernant votre " + raison
                                                + "."
                                                + "\n\nBonne journée.")
                                        .addAttachment("Note_de_Frais_" + nomDestinataire + ".pdf", pdfByte,
                                                "application/pdf"));
                    } else {
                        mailer.send(
                                Mail.withText(mailDestinataire,
                                        "Justificatif de votre abandon de frais",
                                        "Bonjour " + nomDestinataire
                                                + ",\n\nVoici ci joint votre récapitulatif de votre abandon de frais d'un montant de "
                                                + montant + " € concernant votre " + raison
                                                + "."
                                                + "\n\nBonne journée.")
                                        .addAttachment("Abandon_de_Frais_" + nomDestinataire + ".pdf", pdfByte,
                                                "application/pdf"));
                    }
                    System.out.println("Mail envoyé avec succès en tâche de fond à " + mailDestinataire);
                } catch (Exception e) {
                    System.err.println("Erreur lors de l'envoi du mail asynchrone : " + e.getMessage());
                }
            });
        }

        return "Succès : Note de frais de " + donnees.montant + "€ enregistrée pour " + user.nom;
    }
}