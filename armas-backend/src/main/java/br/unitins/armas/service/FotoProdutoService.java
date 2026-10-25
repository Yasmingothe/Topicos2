package br.unitins.armas.service;

import java.nio.file.Files;
import java.nio.file.Path;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import br.unitins.armas.model.Produto;
import br.unitins.armas.repository.ProdutoRepository;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

// Quando o back sobe, o banco é recriado (drop-and-create) e o produto "esquece" a foto.
// Aqui, logo depois de subir, ele procura na pasta de imagens um arquivo produto-ID.jpg/png/webp
// e liga de novo a foto ao produto.
// Bônus: dá para colocar as fotos direto na pasta com esses nomes, sem usar a tela.
@ApplicationScoped
public class FotoProdutoService {

    private static final String[] EXTENSOES = { "jpg", "jpeg", "png", "webp" };

    @Inject
    ProdutoRepository produtoRepository;

    @ConfigProperty(name = "armas.imagens.pasta")
    String pastaImagens;

    @Transactional
    void aoIniciar(@Observes StartupEvent evento) {
        Path pasta = Path.of(pastaImagens);
        if (!Files.isDirectory(pasta))
            return;

        for (Produto produto : produtoRepository.listAll(io.quarkus.panache.common.Sort.by("id"))) {
            for (String extensao : EXTENSOES) {
                String nome = "produto-" + produto.getId() + "." + extensao;
                if (Files.exists(pasta.resolve(nome))) {
                    produto.setNomeImagem(nome);
                    break;
                }
            }
        }
    }
}
