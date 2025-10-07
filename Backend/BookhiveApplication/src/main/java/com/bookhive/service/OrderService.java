package com.bookhive.service;

import com.bookhive.dto.OrderLineDto;
import com.bookhive.dto.OrderPlaceRequest;
import com.bookhive.dto.OrderResponse;
import com.bookhive.model.Book;
import com.bookhive.model.Order;
import com.bookhive.model.OrderLine;
import com.bookhive.model.OrderStatus;
import com.bookhive.model.OrderType;
import com.bookhive.repo.BookRepository;
import com.bookhive.repo.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repo;
    private final BookRepository bookRepo;

    public OrderService(OrderRepository repo, BookRepository bookRepo) {
        this.repo = repo;
        this.bookRepo = bookRepo;
    }

    @Transactional
    public OrderResponse place(Long userId, OrderPlaceRequest req) {
        List<OrderLine> savedLines = new ArrayList<>();
        int itemsTotal = 0;

        if (req.getLines() == null || req.getLines().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one line");
        }

        for (var l : req.getLines()) {
            Book b = bookRepo.findById(l.getBookId()).orElseThrow();

            if (b.getQuantity() == null || b.getQuantity() < l.getQty()) {
                throw new IllegalArgumentException("Insufficient stock for: " + b.getName());
            }

            int discounted = (b.getDiscount() != null && b.getDiscount() > 0)
                    ? Math.round(b.getPrice() * (1 - b.getDiscount() / 100.0f))
                    : b.getPrice();

            int unit = (l.getType() == OrderType.BUY)
                    ? discounted
                    : Math.round(discounted * 0.5f);

            int subtotal = unit * l.getQty();
            itemsTotal += subtotal;

            // Decrease stock
            b.setQuantity(b.getQuantity() - l.getQty());
            bookRepo.save(b);

            OrderLine line = new OrderLine();
            line.setBookId(b.getId());
            line.setName(b.getName());
            line.setType(l.getType());
            line.setQty(l.getQty());
            line.setPricePerUnit(unit);
            line.setSubtotal(subtotal);

            savedLines.add(line);
        }

        int delivery = (req.getDeliveryFee() == null) ? 30 : req.getDeliveryFee();
        int total = itemsTotal + delivery;

        Order o = new Order();
        o.setUserId(userId);
        o.setTotal(total);
        o.setDeliveryFee(delivery);
        o.setMethod(req.getMethod());
        o.setStatus(OrderStatus.CONFIRMED);
        o.setCreatedAt(Instant.now());

        for (OrderLine l : savedLines) l.setOrderRef(o);
        o.setLines(savedLines);

        repo.save(o);
        return toDto(o);
    }

    public List<OrderResponse> myOrders(Long userId) {
        return repo.findByUserIdOrderByIdDesc(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<OrderResponse> adminAll() {
        return repo.findAll()
                .stream()
                .sorted(Comparator.comparingLong(Order::getId).reversed())
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public OrderResponse setStatus(Long orderId, OrderStatus status) {
        Order o = repo.findById(orderId).orElseThrow();
        o.setStatus(status);
        repo.save(o);
        return toDto(o);
    }

    /** User confirms delivery -> set to DELIVERED (admin will close later). */
    @Transactional
    public OrderResponse markDeliveredByUser(Long userId, Long orderId) {
        Order o = repo.findById(orderId).orElseThrow();
        if (!o.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own orders.");
        }
        if (o.getStatus() != OrderStatus.OUT_FOR_DELIVERY) {
            throw new IllegalArgumentException("You can confirm delivery only when order is OUT_FOR_DELIVERY.");
        }
        o.setStatus(OrderStatus.DELIVERED);
        repo.save(o);
        return toDto(o);
    }

    /** Admin closes only if already DELIVERED. */
    @Transactional
    public OrderResponse adminCloseIfAllowed(Long orderId) {
        Order o = repo.findById(orderId).orElseThrow();
        if (o.getStatus() != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Order can be closed only after user confirms delivery.");
        }
        o.setStatus(OrderStatus.CLOSED);
        repo.save(o);
        return toDto(o);
    }

    private OrderResponse toDto(Order o) {
        List<OrderLineDto> lines = new ArrayList<>();
        if (o.getLines() != null) {
            for (OrderLine l : o.getLines()) {
                OrderLineDto ldto = new OrderLineDto();
                ldto.setBookId(l.getBookId());
                ldto.setName(l.getName());
                ldto.setType(l.getType());
                ldto.setQty(l.getQty());
                ldto.setPricePerUnit(l.getPricePerUnit());
                ldto.setSubtotal(l.getSubtotal());
                lines.add(ldto);
            }
        }

        OrderResponse dto = new OrderResponse();
        dto.setId(o.getId());
        dto.setUserId(o.getUserId());
        dto.setTotal(o.getTotal());
        dto.setDeliveryFee(o.getDeliveryFee());
        dto.setMethod(o.getMethod());
        dto.setStatus(o.getStatus());
        dto.setCreatedAt(o.getCreatedAt());
        dto.setLines(lines);
        return dto;
    }
}
