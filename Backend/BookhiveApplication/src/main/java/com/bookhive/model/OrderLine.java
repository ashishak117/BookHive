package com.bookhive.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_lines")
public class OrderLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "orderRef_id")
    private Order orderRef;

    private Long bookId;
    private String name;

    @Enumerated(EnumType.STRING)
    private OrderType type;

    private Integer qty;
    private Integer pricePerUnit;
    private Integer subtotal;

    public OrderLine() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrderRef() { return orderRef; }
    public void setOrderRef(Order orderRef) { this.orderRef = orderRef; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public OrderType getType() { return type; }
    public void setType(OrderType type) { this.type = type; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }

    public Integer getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(Integer pricePerUnit) { this.pricePerUnit = pricePerUnit; }

    public Integer getSubtotal() { return subtotal; }
    public void setSubtotal(Integer subtotal) { this.subtotal = subtotal; }
}
