package com.bookhive.controller;

import com.bookhive.dto.OrderPlaceRequest;
import com.bookhive.dto.OrderResponse;
import com.bookhive.security.JwtService;
import com.bookhive.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orders;
    private final JwtService jwt;

    public OrderController(OrderService orders, JwtService jwt) {
        this.orders = orders;
        this.jwt = jwt;
    }

    private Long userIdFrom(String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        Number uid = jwt.getAllClaims(token).get("uid", Number.class);
        return uid.longValue();
    }

    @PostMapping
    public ResponseEntity<OrderResponse> place(@RequestHeader("Authorization") String auth,
                                               @RequestBody OrderPlaceRequest req) {
        return ResponseEntity.ok(orders.place(userIdFrom(auth), req));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<OrderResponse>> mine(@RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(orders.myOrders(userIdFrom(auth)));
    }

    /** User confirms delivery → status becomes DELIVERED (admin will close) */
    @PatchMapping("/{orderId}/delivered")
    public ResponseEntity<OrderResponse> userDelivered(@RequestHeader("Authorization") String auth,
                                                       @PathVariable("orderId") Long orderId) {
        Long uid = userIdFrom(auth);
        return ResponseEntity.ok(orders.markDeliveredByUser(uid, orderId));
    }
}
