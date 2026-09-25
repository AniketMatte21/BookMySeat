package com.search_service.Repository;

import com.search_service.Document.Event;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface SearchEventRepo extends ElasticsearchRepository<Event, Long> {
}
