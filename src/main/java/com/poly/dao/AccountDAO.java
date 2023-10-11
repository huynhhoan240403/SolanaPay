package com.poly.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.poly.entity.Account;


public interface AccountDAO extends JpaRepository<Account, String> {
	Account findByUsername(String username);
	

	@Query("SELECT a FROM Account a WHERE a.email LIKE ?1")
	Account getAccountByEmail(String email);
}
