package org.acme.entity;

import java.util.List;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class User extends PanacheEntity {
    public String nom;
    public String mail;

    @OneToMany(mappedBy = "user")
    public List<NoteDeFrais> notesDeFraisUser;
}
