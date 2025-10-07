package com.bookhive.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Address {
    private String line;

    public Address() { }

    public Address(String line) { this.line = line; }

    public String getLine() { return line; }
    public void setLine(String line) { this.line = line; }
}
