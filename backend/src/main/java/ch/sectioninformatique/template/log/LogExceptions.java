package ch.sectioninformatique.template.log;

import ch.sectioninformatique.template.app.exceptions.AppException;
import ch.sectioninformatique.template.app.exceptions.MessageKeyProvider;
import org.springframework.http.HttpStatus;

public class LogExceptions {

    public  static class LogNotFoundException extends AppException implements MessageKeyProvider {
        private final String messageKey;
        private final Object[] messageArgs;

        public LogNotFoundException() {
            super(HttpStatus.NOT_FOUND);
            this.messageKey = "log.notFound";
            this.messageArgs = NO_ARGS;
        }

        public LogNotFoundException(Long id) {
            super(HttpStatus.NOT_FOUND);
            this.messageKey = "log.notFound.id";
            this.messageArgs = new Object[] { id };
        }

        @Override
        public String getMessageKey() {
            return messageKey;
        }

        @Override
        public Object[] getMessageArgs() {
            return messageArgs;
        }
    }

}