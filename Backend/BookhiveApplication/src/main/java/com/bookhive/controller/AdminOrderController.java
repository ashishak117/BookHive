package com.bookhive.controller;

import com.bookhive.dto.OrderResponse;
import com.bookhive.model.OrderStatus;
import com.bookhive.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orders;

    public AdminOrderController(OrderService orders) {
        this.orders = orders;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> all() {
        return ResponseEntity.ok(orders.adminAll());
    }

    @PatchMapping("/{orderId}/status/{status}")
    public ResponseEntity<OrderResponse> setStatusPath(@PathVariable("orderId") Long orderId,
                                                       @PathVariable("status") OrderStatus status) {
        if (status == OrderStatus.CLOSED) {
            // only close after user confirmed delivery
            return ResponseEntity.ok(orders.adminCloseIfAllowed(orderId));
        }
        return ResponseEntity.ok(orders.setStatus(orderId, status));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> setStatusBody(@PathVariable("orderId") Long orderId,
                                                       @RequestBody Map<String,String> body) {
        String s = body.get("status");
        if (s == null) throw new IllegalArgumentException("Missing 'status' in request body");
        OrderStatus status = OrderStatus.valueOf(s);
        if (status == OrderStatus.CLOSED) {
            return ResponseEntity.ok(orders.adminCloseIfAllowed(orderId));
        }
        return ResponseEntity.ok(orders.setStatus(orderId, status));
    }
}
