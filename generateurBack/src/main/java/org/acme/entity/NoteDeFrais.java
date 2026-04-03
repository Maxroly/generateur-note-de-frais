package org.acme.entity;

import java.time.LocalDate;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class NoteDeFrais extends PanacheEntity {
    public String raison;
    public String budget;
    public float montant;
    public LocalDate dateDemande;
    public String typeDeFrais;
    public String iban;
    public String bic;

    @ManyToOne
    public User user;
}