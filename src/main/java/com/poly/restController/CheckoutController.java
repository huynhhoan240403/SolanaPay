package com.poly.restController;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.poly.entity.CheckoutSessionRequest;
import com.poly.entity.CheckoutSessionResponse;
import com.poly.entity.PaymentUrlResponse;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/checkout")
public class CheckoutController {

	@Value("${candypay.private.api.key}")
	private String privateApiKey;

	@Value("${candypay.public.api.key}")
	private String publicApiKey;

	@Value("${candypay.endpoint}")
	private String candypayEndpoint;

	private RestTemplate restTemplate = new RestTemplate();

///////////////BẢNG 3/////////////////  
//	@PostMapping("/session")
//	public ResponseEntity<CheckoutSessionResponse> createCheckoutSession(@RequestBody CheckoutSessionRequest request) {
//		String apiUrl = candypayEndpoint + "/api/v1/session";
//		HttpHeaders headers = new HttpHeaders();
//		headers.setBearerAuth(privateApiKey);
//		HttpEntity<CheckoutSessionRequest> requestBody = new HttpEntity<>(request, headers);
//
//		ResponseEntity<CheckoutSessionResponse> responseEntity = restTemplate.postForEntity(apiUrl, requestBody,
//				CheckoutSessionResponse.class);
//		return responseEntity;
//	}
	@PostMapping("/session")
	public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, Object> requestData) {
	    HttpHeaders headers = new HttpHeaders();
	    headers.set("Authorization", "Bearer " + privateApiKey);
	    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestData, headers);

	    RestTemplate restTemplate = new RestTemplate();
	    String url = candypayEndpoint + "/session";
	    ResponseEntity<Map> responseEntity = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

	    Map<String, String> response = new HashMap<>();
	    response.put("session_id", responseEntity.getBody().get("session_id").toString());
	    response.put("order_id", responseEntity.getBody().get("order_id").toString());
	    return ResponseEntity.ok(response);
	}

///////////////BẢNG 2/////////////////  
//    @PostMapping("/session")
//    public CheckoutSessionResponse createCheckoutSession(@RequestBody CheckoutSessionRequest request) {
//        // Xử lý yêu cầu tạo checkout session tại đây
//    	
//        // Trả về response có chứa session_id và order_id
//        CheckoutSessionResponse response = new CheckoutSessionResponse();
//        // Điền thông tin session_id và order_id vào response
//        return response;
//    }
//
//    @GetMapping("/session/payment_url")
//    public PaymentUrlResponse getPaymentUrl(@RequestParam("session_id") String sessionId) {
//        // Xử lý yêu cầu và trả về payment URL dựa trên sessionId
//        PaymentUrlResponse response = new PaymentUrlResponse();
//        // Điền thông tin payment_url vào response
//        return response;
//    }

///////////////BẢNG 1/////////////////  
//    @PostMapping("/session")
//    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, Object> requestData) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + privateApiKey);
//        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestData, headers);
//
//        RestTemplate restTemplate = new RestTemplate();
//        String url = candypayEndpoint + "/session";
//        ResponseEntity<Map> responseEntity = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);
//
//        Map<String, String> response = new HashMap<>();
//        response.put("session_id", responseEntity.getBody().get("session_id").toString());
//        response.put("order_id", responseEntity.getBody().get("order_id").toString());
//        return ResponseEntity.ok(response);
//    }
//    

}
