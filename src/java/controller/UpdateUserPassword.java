/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.User_Dto;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author dulan
 */
@MultipartConfig
@WebServlet(name = "UpdateUserPassword", urlPatterns = {"/UpdateUserPassword"})
public class UpdateUserPassword extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);

        String currentPassword = req.getParameter("currentPassword");
        String newPassowrd = req.getParameter("newPassword");

        HttpSession httpSession = req.getSession();

        if (httpSession.getAttribute("user") != null) {

            Session session = HibernateUtil.getSessionFactory().openSession();

            User_Dto user_Dto = (User_Dto) httpSession.getAttribute("user");

            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("email", user_Dto.getEmail()));
            User user = (User) criteria1.uniqueResult();

            if (user != null) {

                if (user.getPassword().equals(currentPassword)) {
                    if (Validations.isPasswordValid(newPassowrd)) {
                        user.setPassword(newPassowrd);

                        session.update(user);
                        session.beginTransaction().commit();
                        responseJson.addProperty("success", true);
                        responseJson.addProperty("message", "User Details Updated");
                    } else {
                        responseJson.addProperty("message", "Enter A Valid Password");
                    }
                } else {
                    responseJson.addProperty("message", "Old Password Doesnt Match");
                }

            } else {
                responseJson.addProperty("message", "User Not Found");
            }

        } else {
            responseJson.addProperty("message", "User Not Signed In");
        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(responseJson));
    }

}
