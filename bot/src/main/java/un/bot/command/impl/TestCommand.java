package un.bot.command.impl;

import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import discord4j.core.object.command.ApplicationCommandInteractionOption;
import discord4j.core.object.command.ApplicationCommandInteractionOptionValue;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import un.bot.command.SlashCommand;

@Component
public class TestCommand implements SlashCommand {
    @Override
    public String getName(){
        return "test";
    }

    @Override
    public Mono<Void> handle(ChatInputInteractionEvent event) {
        String name = event.getOption("name")
                .flatMap(ApplicationCommandInteractionOption::getValue)
                .map(ApplicationCommandInteractionOptionValue::asString)
                .get();

        return event.reply().withEphemeral(true).withContent("This is a test. You said your name is " + name);
    }
}
