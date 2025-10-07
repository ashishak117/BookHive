package com.bookhive.dto;

import com.bookhive.model.PaymentMethod;
import java.util.List;

public class OrderPlaceRequest {
    private PaymentMethod method;
    private Integer deliveryFee;
    private List<OrderPlaceLine> lines;

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public Integer getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(Integer deliveryFee) { this.deliveryFee = deliveryFee; }

    public List<OrderPlaceLine> getLines() { return lines; }
    public void setLines(List<OrderPlaceLine> lines) { this.lines = lines; }
}
