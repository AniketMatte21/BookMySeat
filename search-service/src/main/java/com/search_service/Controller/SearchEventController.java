package com.search_service.Controller;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.search_service.Document.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/search-event")
@RequiredArgsConstructor
public class SearchEventController {

    private final ElasticsearchClient elasticSearchClient;

    @GetMapping("/_search")
    public ResponseEntity<List<Event>> search(@RequestParam("q") String keyword) throws IOException {
        SearchResponse<Event> response = elasticSearchClient.search(s -> s
                        .index("events")
                        .query(q -> q
                                .multiMatch(m -> m
                                        .fields("title^3", "description","genre")
                                        .query(keyword)
                                        .fuzziness("AUTO")
                                )
                        ),
                Event.class
        );

        List<Event> results = Collections.singletonList(response.hits().hits().stream()
                .map(Hit::source)
                .toList().get(0));

        return ResponseEntity.ok(results);
    }


}
