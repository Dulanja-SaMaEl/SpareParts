/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.User_Dto;
import entity.Order_item;
import entity.Product;
import entity.Product_Order;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author dulan
 */
@WebServlet(name = "LoadOrdersHistory", urlPatterns = {"/LoadOrdersHistory"})
public class LoadOrdersHistory extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);

        HttpSession httpSession = req.getSession();

        Session session = HibernateUtil.getSessionFactory().openSession();

        if (httpSession.getAttribute("user") != null) {
            //
            User_Dto user_Dto = (User_Dto) httpSession.getAttribute("user");

            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("email", user_Dto.getEmail()));
            User user = (User) criteria1.uniqueResult();

            if (user != null) {
                //User found
                Criteria criteria2 = session.createCriteria(Product.class);
                criteria2.add(Restrictions.eq("user", user));
                List<Product> products = criteria2.list();

                if (!products.isEmpty()) {
                    //product orders found

                    Criteria criteria3 = session.createCriteria(Order_item.class);
                    criteria3.add(Restrictions.in("product", products));
                    List<Order_item> order_items = criteria3.list();

                    

                    responseJson.addProperty("success", true);
                    responseJson.add("orderList", gson.toJsonTree(order_items));
                } else {
                    //no product orders found
                    responseJson.addProperty("message", "No product orders found");
                }

            } else {
                //User not found
                responseJson.addProperty("message", "User not found");
            }
        } else {
            responseJson.addProperty("message", "User not Signed In");
        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(responseJson));
    }

}
