import { PizzeriaError } from "../../../pizzeria/error/pizzeria.exceptions";
import { Ingredients } from "../../enum/ingredients.enum";
import { PizzaServiceError } from "../../error/pizza.exceptions";
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
  const addIngredents = () => {
    objectUnderTest.addIngredient(Ingredients.Cheese, 0);
    objectUnderTest.addIngredient(Ingredients.peperoni, 2);
    objectUnderTest.addIngredient(Ingredients.Pineapple, 2);
    objectUnderTest.addIngredient(Ingredients.tomato, 2);
  };
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
    //When
    objectUnderTest.addIngredient(mockedIngredient);
    objectUnderTest.addIngredient(mockedIngredient, 3);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
  });
  it("Should add pizza to the set", () => {
    //Given
    mockedPizzaOne = new PizzaDTO("test pizza", 30, []);
    //When
    objectUnderTest.addPizza(mockedPizzaOne);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
  });
  it("Should throw error if there isn't enough ingredients in stock", () => {
    //Given
    addIngredents();
    mockedPizzaOne = new PizzaDTO(mockedPizzaNameOne, 30, ingredientsOne);
    const mockedPizzaTwo = new PizzaDTO(mockedPizzaNameTwo, 30, ingredientsTwo);
    //When
    objectUnderTest.addPizza(mockedPizzaOne);
    objectUnderTest.addPizza(mockedPizzaTwo);
    //Then
    expect(() =>
      objectUnderTest.updateIngredientsAfterOrder([
        mockedPizzaOne,
        mockedPizzaTwo,
      ])
    ).toThrow(PizzaServiceError);
  });
  it("Should restore ingredients in service on error", () => {
    //Given
    addIngredents();
    mockedPizzaOne = new PizzaDTO(mockedPizzaNameOne, 30, ingredientsOne);
    const mockedPizzaTwo = new PizzaDTO(mockedPizzaNameTwo, 30, ingredientsTwo);
    //When
    objectUnderTest.addPizza(mockedPizzaOne);
    objectUnderTest.addPizza(mockedPizzaTwo);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
    expect(() =>
      objectUnderTest.updateIngredientsAfterOrder([
        mockedPizzaOne,
        mockedPizzaTwo,
      ])
    ).toThrow(PizzaServiceError);
  });
});
