package com.bookhive.dto;

public class AddressDto {
    private String line;

    public AddressDto() { }
    public AddressDto(String line) { this.line = line; }

    public String getLine() { return line; }
    public void setLine(String line) { this.line = line; }
}
