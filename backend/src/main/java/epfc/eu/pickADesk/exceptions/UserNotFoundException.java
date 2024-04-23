package epfc.eu.pickADesk.exceptions;

    public class UserNotFoundException extends RuntimeException {

        /**
         * Constructor for UserNotFoundException.
         * @param message the detail message.
         */
        public UserNotFoundException(String message) {
            super(message);
        }

        /**
         * Constructor for UserNotFoundException.
         * @param message the detail message.
         * @param cause the cause (which is saved for later retrieval by the Throwable.getCause() method).
         */
        public UserNotFoundException(String message, Throwable cause) {
            super(message, cause);
        }
}
