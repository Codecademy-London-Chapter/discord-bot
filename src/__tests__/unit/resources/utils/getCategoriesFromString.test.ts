import { describe, expect, it } from 'vitest'
import getCategoriesFromString from '../../../../commands/slash/resources/utils/getCategoriesFromString';

describe("getCategoriesFromString", () => {
  describe("given comma separated categories", () => {
    it("should return expected categories", () => {
      const categoryString = "one,two,three";
      const categories = getCategoriesFromString(categoryString);

      expect(categories).toEqual(["one", "two", "three"]);
    });
  });

  describe("given comma and trailing space separated categories", () => {
    it("should return expected categories", () => {
      const categoryString = "one, two, three";
      const categories = getCategoriesFromString(categoryString);

      expect(categories).toEqual(["one", "two", "three"]);
    });
  });

  describe("given comma and leading space separated categories", () => {
    it("should return expected categories", () => {
      const categoryString = "one ,two ,three";
      const categories = getCategoriesFromString(categoryString);

      expect(categories).toEqual(["one", "two", "three"]);
    });
  });

  describe("given comma and any number of leading / trailing spaces separated categories", () => {
    it("should return expected categories", () => {
      const categoryString = "one   , two  ,    three";
      const categories = getCategoriesFromString(categoryString);

      expect(categories).toEqual(["one", "two", "three"]);
    });
  });

  describe("given comma and mixed white space separated categories", () => {
    it("should return expected categories", () => {
      const categoryString = "one\t \r ,\t two \n \t,  \n\t  three";
      const categories = getCategoriesFromString(categoryString);

      expect(categories).toEqual(["one", "two", "three"]);
    });
  });

  describe("given comma and space separated multi-word categories", () => {
    it("should return expected categories", () => {
      const categoryString = "one one, two, three";
      const categories = getCategoriesFromString(categoryString);

      expect(categories).toEqual(["one one", "two", "three"]);
    });
  });

  describe("given multiple commas and space separated categories", () => {
    it("should return expected categories", () => {
      const categoryString = "one ,, two,, three";
      const categories = getCategoriesFromString(categoryString);

      expect(categories).toEqual(["one", "two", "three"]);
    });
  });

  describe("given an empty string", () => {
    it("should return an empty array", () => {
      const categoryString = "";
      const categories = getCategoriesFromString(categoryString);

      expect(categories).toEqual([]);
    });
  });

  describe("given an string of delimiters only", () => {
    it("should return an empty array", () => {
      const categoryString = ", , \t , \r, \n,";
      const categories = getCategoriesFromString(categoryString);

      expect(categories).toEqual([]);
    });
  });
});
