package com.poly.entity;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@SuppressWarnings("serial")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Accounts")
public class Account implements Serializable{
		@Id
	     String username;
	     String password;
	     String email;
	     String fullname;

	    
	    @OneToMany(mappedBy = "account",fetch = FetchType.EAGER)
	    private List<Authorities> authorities;

	   
	    @OneToMany(mappedBy = "account")
	    private List<BankAccount> bankAccounts;

	   
	    @OneToMany(mappedBy = "account")
	    private List<Transaction> transactions;

}