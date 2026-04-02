package org.acme.entity;

import java.time.LocalDate;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Lob;
import jakarta.persistence.Column;

@Entity
public class NoteDeFrais extends PanacheEntity {
    public String raison;
    public String budget;
    public float montant;
    public LocalDate dateDemande;
    public String typeDeFrais;
    public String iban;
    public String bic;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    public String pdfBase64;

    @ManyToOne
    public User user;
}