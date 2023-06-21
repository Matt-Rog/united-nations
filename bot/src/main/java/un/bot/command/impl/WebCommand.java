package un.bot.command.impl;

import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import discord4j.core.object.component.ActionRow;
import discord4j.core.object.component.Button;
import discord4j.core.object.component.LayoutComponent;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import un.bot.command.SlashCommand;

@Component
public class WebCommand implements SlashCommand {
    @Override
    public String getName() { return "web"; }

    @Override
    public Mono<Void> handle(ChatInputInteractionEvent event) {

        Button authButton = Button.link("https://united-nations.vercel.app/auth", "Sign up");

        return event.reply().withComponents(ActionRow.of(authButton));
    }
}
