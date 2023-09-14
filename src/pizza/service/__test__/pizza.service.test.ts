import { PizzeriaError } from "../../../exceptions/pizzeria.exceptions";
import { Ingredients } from "../../enum/ingredients.enum";
import { PizzaDTO } from "../../model/pizzaDTO";
import { PizzaService } from "../pizza.service";

describe("PizzaService test suite", () => {
  let objectUnderTest: PizzaService;
  let mockedPizzaOne: PizzaDTO;
  let mockedPizzaNameOne: string;
  let mockedPizzaNameTwo: string;
  let ingredientsMap: Map<Ingredients, number>;
  let ingredientsOne: Ingredients[];
  let ingredientsTwo: Ingredients[];
  beforeEach(() => {
    objectUnderTest = new PizzaService();
  });
  beforeAll(() => {
    mockedPizzaNameOne = "test pizza one";
    mockedPizzaNameTwo = "test pizza two";
    ingredientsMap = new Map<Ingredients, number>();
    ingredientsOne = [Ingredients.Cheese, Ingredients.Pineapple];
    ingredientsTwo = [Ingredients.peperoni, Ingredients.tomato];
  });
  it("Should add new ingredient to map", () => {
    //Given
    const mockedIngredient = Ingredients.Cheese;
    //When
    objectUnderTest.addIngredient(mockedIngredient);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
  });
  it("Should update amount of ingredient if its already in map", () => {
    //Given
    const mockedIngredient = Ingredients.Eggs;
    const map = new Map<Ingredients, number>();
    map.set(mockedIngredient, 20);
    //When
    objectUnderTest = new PizzaService(map);
    objectUnderTest.addIngredient(mockedIngredient, 3);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
  });
  it("Should add pizza to pizza list", () => {
    //Given
    mockedPizzaOne = new PizzaDTO("test pizza", 30, []);
    //When
    objectUnderTest.addPizza(mockedPizzaOne);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
  });
  it("Should find pizza by name and  delete from sevice", () => {
    //Given
    const testPizzaName = "test pizza";
    mockedPizzaOne = new PizzaDTO(testPizzaName, 30, []);
    const mockedPizzaOneListSet = new Set<PizzaDTO>();
    mockedPizzaOneListSet.add(mockedPizzaOne);
    //When
    objectUnderTest = new PizzaService(
      new Map<Ingredients, number>(),
      mockedPizzaOneListSet
    );
    const resultOne = objectUnderTest;
    objectUnderTest.delatePizza(testPizzaName);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
    expect(resultOne).toMatchSnapshot();
  });
  describe("Get ingredients map of order test suite", () => {
    it("Should find pizza by name array and return map of ingredients needed to cook them", () => {
      //Given
      ingredientsMap.set(Ingredients.Cheese, 2);
      ingredientsMap.set(Ingredients.peperoni, 2);
      ingredientsMap.set(Ingredients.Pineapple, 2);
      ingredientsMap.set(Ingredients.tomato, 2);
      mockedPizzaOne = new PizzaDTO(mockedPizzaNameOne, 30, ingredientsOne);
      const mockedPizzaTwo = new PizzaDTO(
        mockedPizzaNameTwo,
        30,
        ingredientsTwo
      );
      const mockedPizzaList = new Set<PizzaDTO>()
        .add(mockedPizzaOne)
        .add(mockedPizzaTwo);
      objectUnderTest = new PizzaService(ingredientsMap, mockedPizzaList);
      //When
      const resultOne = objectUnderTest.getIngredientsMapOfOrder([
        mockedPizzaNameOne,
        mockedPizzaNameTwo,
      ]);
      //Then
      expect(objectUnderTest).toMatchSnapshot();
      expect(resultOne).toMatchSnapshot();
    });
    it("Should throw pizzeriaError if pizza isn't on pizzalist", () => {
      //Given
      ingredientsMap.set(Ingredients.Cheese, 2);
      ingredientsMap.set(Ingredients.Pineapple, 2);
      mockedPizzaOne = new PizzaDTO(mockedPizzaNameOne, 30, ingredientsOne);
      const mockedPizzaList = new Set<PizzaDTO>().add(mockedPizzaOne);
      objectUnderTest = new PizzaService(ingredientsMap, mockedPizzaList);
      //Then
      expect(objectUnderTest).toMatchSnapshot();
      expect(() =>
        objectUnderTest.getIngredientsMapOfOrder([
          mockedPizzaNameOne,
          mockedPizzaNameTwo,
        ])
      ).toThrow(PizzeriaError);
    });
    it("Should throw if there isn't enough ingredients in service", () => {
      //Given
      ingredientsMap.set(Ingredients.Cheese, 0);
      ingredientsMap.set(Ingredients.peperoni, 2);
      ingredientsMap.set(Ingredients.Pineapple, 2);
      ingredientsMap.set(Ingredients.tomato, 2);
      mockedPizzaOne = new PizzaDTO(mockedPizzaNameOne, 30, ingredientsOne);
      const mockedPizzaTwo = new PizzaDTO(
        mockedPizzaNameTwo,
        30,
        ingredientsTwo
      );
      const mockedPizzaList = new Set<PizzaDTO>()
        .add(mockedPizzaOne)
        .add(mockedPizzaTwo);
      //When
      objectUnderTest = new PizzaService(ingredientsMap, mockedPizzaList);

      //Then
      expect(objectUnderTest).toMatchSnapshot();
      expect(() =>
        objectUnderTest.getIngredientsMapOfOrder([
          mockedPizzaNameOne,
          mockedPizzaNameTwo,
        ])
      ).toThrow(PizzeriaError);
    });
  });

  it("Should update ingredients in service", () => {
    //Given
    const ingredientsMapOne = new Map<Ingredients, number>();
    const ingredientsMapTwo = new Map<Ingredients, number>();
    ingredientsMapOne.set(Ingredients.Salad, 2);
    ingredientsMapOne.set(Ingredients.Cheese, 2);
    ingredientsMapTwo.set(Ingredients.peperoni, 20);
    ingredientsMapTwo.set(Ingredients.tomato, 20);
    objectUnderTest = new PizzaService(ingredientsMapOne);
    //When
    const resultOne = objectUnderTest;
    objectUnderTest.updateIngredientsAfterOrder(ingredientsMapTwo);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
    expect(resultOne).toMatchSnapshot();
  });
});
