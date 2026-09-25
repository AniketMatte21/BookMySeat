package com.api_gateway;

import com.api_gateway.Configuration.CurrentUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.uri;
import static org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions.lb;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;

@SpringBootApplication
@EnableFeignClients
public class ApiGatewayApplication {

	@Autowired
	private CurrentUser currentUser;

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

	@Bean
	public RouterFunction<ServerResponse> customRoutes() {
		// @formatter:off
		return route("user-service-route").route(path("/api/users/**"),http()).filter(lb("USER-SERVICE")).
				filter((request, next)->{
					String openId= currentUser.getId();
					if(openId==null || openId.isBlank())
					{
						return ServerResponse.status(401).body("Unauthorized");
					}

					ServerRequest req= ServerRequest.from(request).header("X-User-OpenId",openId).build();

					return next.handle(req);
				}).build().and(route("event-service-route").route(path("/api/event/**","/api/event","/api/booking/**"),http())
				.filter(lb("EVENT-SERVICE")).filter((request,next)->{
							String openId= currentUser.getId();
							if(openId==null || openId.isBlank())
							{
								return ServerResponse.status(401).body("Unauthorized");
							}

							ServerRequest req= ServerRequest.from(request).header("x-user-id",openId).build();

							return next.handle(req);
						}).build())
				.and(route("search-service-route").route(path("/api/search-event/_search/**"),http()
						).filter(lb("SEARCH-SERVICE")).build()).and(
								route("payment-service-route").route(path("/api/payment/**"),http()).filter(lb("PAYMENT-SERVICE")).filter(
										(request,next)->{
											String openId= currentUser.getId();

											if(request.path().equals("/api/payment/webhook"))
											{
												return next.handle(request);
											}
											if(openId==null || openId.isBlank())
											{
												return ServerResponse.status(401).body("Unauthorized");
											}

											ServerRequest req= ServerRequest.from(request).header("X-User-id",openId).build();

											return next.handle(req);

										}
								).build()
				);

		// @formatter:on
	}



		}