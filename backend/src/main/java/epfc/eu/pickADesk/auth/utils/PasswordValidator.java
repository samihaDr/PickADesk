package epfc.eu.pickADesk.auth.utils;

import java.util.regex.Pattern;

public class PasswordValidator {
    private static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[!@#$%^&*_-])[A-Za-z0-9!@#$%^&*_-]{8,}$";

    public static boolean isValidPassword(String password) {
        return Pattern.compile(PASSWORD_PATTERN).matcher(password).matches();
    }
}
