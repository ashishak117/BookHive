package com.bookhive.dto;

import com.bookhive.model.OrderStatus;
import com.bookhive.model.PaymentMethod;

import java.time.Instant;
import java.util.List;

public class OrderResponse {
    private Long id;
    private Long userId;
    private Integer total;
    private Integer deliveryFee;
    private PaymentMethod method;
    private OrderStatus status;
    private Instant createdAt;
    private List<OrderLineDto> lines;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }

    public Integer getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(Integer deliveryFee) { this.deliveryFee = deliveryFee; }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<OrderLineDto> getLines() { return lines; }
    public void setLines(List<OrderLineDto> lines) { this.lines = lines; }
}
