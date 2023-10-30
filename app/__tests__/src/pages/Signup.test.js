import React from "react";
import renderer from 'react-test-renderer';
import { MemoryRouter } from "react-router-dom"; 
import { describe, it, expect, fireEvent } from '@jest/globals';
import Signup from '../../../src/pages/Signup';
import axios from 'axios';
import MockAdapter from'axios-mock-adapter';
import AuthServices from '../../../src/services/auth.services'

jest.useFakeTimers();

jest.mock('../../../src/services/course.services', () => ({
    getAllCourses: jest.fn(async () => {
        return mockedCourses;
    }),
}));

jest.mock('../../../src/helpers/environment', () => ({
    BACKEND_URL: 'http://localhost:8888',
    REFRESH_TOKEN_URL: 'http://localhost:8888/auth/refresh/jwt'
}));

describe("Signup Component", () => {

it("can render signup page without errors", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    )});

    expect(component.toJSON()).toMatchSnapshot();
});

it("can navigate to the welcome page and the login pages", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    )});

    const entrarButton = component.root.findAllByProps({ to: "/welcome" })[1];
    const submitButton = component.root.findByProps({ to: "/login" });

    expect(entrarButton && submitButton).toBeTruthy();
    });

  it("can submit a correct HTTP request", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    )});

    const mockAxios = new MockAdapter(axios);

    mockAxios.onPost('http://127.0.0.1:8888/api/credentials/signup').reply(201);

    const formData = {
        name: "Name",
        email: "mail@HotMail.com",
        password: "wordOfPass",
      };

    AuthServices.postUserSignup({ formData });

    expect(mockAxios.history.post.length).toBe(1); 
  });

  it("can disable the submit button of the form is invalid", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    )});

    const submitButton = component.root.findByProps({id: "submitSignupButton"})
    expect(submitButton.props.disabled).toBe(true);
  });

  it("can hide or show password", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    )});
    const passwordField = component.root.findByProps({id: "passwordField"});
    expect(passwordField.props.type).toBe("password");

    const hidePasswordButton = component.root.findByProps({id: "hidePasswordIcon"});
    await renderer.act(async () => {
        hidePasswordButton.props.onClick();
    })
    expect(passwordField.props.type).toBe("text");
    
  });
});