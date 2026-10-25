package br.unitins.armas.service;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Base64;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import jakarta.enterprise.context.ApplicationScoped;

// transforma a senha em um "hash": um código que não dá para voltar para a senha.
// no login, calcula o hash de novo e compara com o guardado.
// formato guardado: pbkdf2$iteracoes$salt$hash
@ApplicationScoped
public class SenhaService {

    private static final String ALGORITMO = "PBKDF2WithHmacSHA256";
    private static final int ITERACOES = 120_000;
    private static final int TAMANHO_SALT = 16;
    private static final int TAMANHO_HASH_BITS = 256;

    private final SecureRandom aleatorio = new SecureRandom();

    public String gerarHash(String senha) {
        // salt = um valor aleatório; faz duas senhas iguais terem hashes diferentes
        byte[] salt = new byte[TAMANHO_SALT];
        aleatorio.nextBytes(salt);

        byte[] hash = calcular(senha, salt, ITERACOES);
        return "pbkdf2$" + ITERACOES + "$" + base64(salt) + "$" + base64(hash);
    }

    public boolean confere(String senha, String guardado) {
        if (senha == null || guardado == null)
            return false;

        String[] partes = guardado.split("\\$");
        if (partes.length != 4 || !partes[0].equals("pbkdf2"))
            return false;

        try {
            int iteracoes = Integer.parseInt(partes[1]);
            byte[] salt = Base64.getDecoder().decode(partes[2]);
            byte[] esperado = Base64.getDecoder().decode(partes[3]);
            byte[] calculado = calcular(senha, salt, iteracoes);

            // compara sem "atalho" de tempo, para não dar pista de quantos bytes acertou
            return MessageDigest.isEqual(esperado, calculado);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private byte[] calcular(String senha, byte[] salt, int iteracoes) {
        try {
            KeySpec especificacao = new PBEKeySpec(senha.toCharArray(), salt, iteracoes, TAMANHO_HASH_BITS);
            return SecretKeyFactory.getInstance(ALGORITMO).generateSecret(especificacao).getEncoded();
        } catch (Exception e) {
            throw new IllegalStateException("Não foi possível gerar o hash da senha.", e);
        }
    }

    private String base64(byte[] bytes) {
        return Base64.getEncoder().encodeToString(bytes);
    }
}
