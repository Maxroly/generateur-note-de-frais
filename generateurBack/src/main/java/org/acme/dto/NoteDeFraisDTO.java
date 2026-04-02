package org.acme.dto;

import java.time.LocalDate;

public class NoteDeFraisDTO {
    public String nom;
    public String mail;
    public String raison;
    public String budget;
    public float montant;
    public LocalDate dateDemande;
    public String typeDeFrais;
    public String iban;
    public String bic;
    public String pdfBase64;
    public boolean envoyerMail;
}