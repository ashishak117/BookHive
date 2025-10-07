package com.bookhive.dto;

import com.bookhive.model.OrderType;

public class OrderPlaceLine {
    private Long bookId;
    private OrderType type;
    private Integer qty;

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public OrderType getType() { return type; }
    public void setType(OrderType type) { this.type = type; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
}
