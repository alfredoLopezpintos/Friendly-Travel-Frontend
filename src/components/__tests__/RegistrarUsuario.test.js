import React from "react";
import {RegistrarUsuario} from "../pages/RegistrarUsuario";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

jest.mock("axios", () => ({
  axiosInterceptor: jest.fn(),
}));



// jest.mock('../pages/RegistrarUsuario', () => ({
//   ...jest.RegistrarUsuario,
//   borrarCampos: jest.fn(),
// }));

describe("Testing borrarCampos function", () => {
  test("It should clear the form fields", () => {
    let form = {
      name: "John Doe",
      email: "johndoe@example.com",
      message: "Hello, world!",
    };

    RegistrarUsuario.borrarCampos(form);
  

    expect(form).toEqual({
      name: "",
      email: "",
      message: "",
    });
  });
});
