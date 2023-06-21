package un.bot.command.impl;

import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import discord4j.core.object.entity.channel.MessageChannel;
import discord4j.rest.interaction.InteractionResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import un.bot.command.SlashCommand;

@Component
public class PingCommand implements SlashCommand {
    @Override
    public String getName() { return "ping"; }

    @Override
    public Mono<Void> handle(ChatInputInteractionEvent event) {
        return event.reply()
                .withEphemeral(true)
                .withContent("Pong!");
    }
}
