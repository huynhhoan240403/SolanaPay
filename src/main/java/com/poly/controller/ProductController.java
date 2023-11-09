package com.poly.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.poly.dao.ProductDAO;
import com.poly.entity.Product;

@Controller
public class ProductController {
	
	@Autowired
	ProductDAO dao;
	
	@RequestMapping("/shop-single.html/{productId}")
	public String getProduct(Model model, @PathVariable("productId") int productId) {
		Product list = dao.findById(productId).get();
		model.addAttribute("prod", list);
		// Chắc chắn rằng listS chứa thông tin về số lượng của size
		return "shop-single";
	}
}
