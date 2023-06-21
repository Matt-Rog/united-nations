package un.bot.config;

import discord4j.core.DiscordClientBuilder;
import discord4j.core.GatewayDiscordClient;
import discord4j.core.event.domain.Event;
import discord4j.core.object.entity.User;
import discord4j.gateway.intent.Intent;
import discord4j.gateway.intent.IntentSet;
import discord4j.rest.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import un.bot.event.EventListener;

import javax.annotation.Resource;
import java.math.BigInteger;
import java.util.List;

@Configuration
@EnableWebMvc
public class BotConfiguration {

    private static final Logger LOG = LoggerFactory.getLogger(BotConfiguration.class);

    @Value("${bot.token}")
    private String token;

    @Value("${discord.application.id}")
    private BigInteger applicationId;

    @Bean("gatewayDiscordClient")
    public <T extends Event> GatewayDiscordClient gatewayDiscordClient(List<EventListener<T>> eventListeners) {
        GatewayDiscordClient client = null;

        try {
            client = DiscordClientBuilder.create(token)
                    .build()
                    .gateway()
                    .login()
                    .block();

            User self = client.getSelf().block();
            LOG.info(
                    "Logged in as {}#{}",
                    self.getUsername(),
                    self.getDiscriminator()
            );

            for (EventListener<T> listener : eventListeners) {
                client.on(listener.getEventType())
                        .flatMap(listener::execute)
                        .onErrorResume(listener::handleError)
                        .subscribe();
            }
        } catch (Exception exception) {
            LOG.error("Be sure to use a valid bot token!", exception);
        }
        LOG.info("GatewayDiscordClient created!");

        return client;
    }

    @Bean
    public RestClient restClient(GatewayDiscordClient client) {
        LOG.info("RestClient created!");
        return client.getRestClient();
    }
}