package com.search_service.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.search_service.Document.Event;
import com.search_service.Repository.SearchEventRepo;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Service
public class CdcConsumerService {

    private final SearchEventRepo searchRepo;
    private final ObjectMapper objectMapper;

    public CdcConsumerService(SearchEventRepo searchRepo, ObjectMapper objectMapper) {
        this.searchRepo = searchRepo;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "mysql_cdc.ticketbookingsystemuserdb.events")
    public void processCdcMessage(String messagePayload) {
        try {
            JsonNode root = objectMapper.readTree(messagePayload);
            JsonNode payload = root.has("payload") ? root.get("payload") : root;

            String operation = payload.get("op").asText(); // "c", "u", "d", "r"

            if ("d".equals(operation)) {
                // DELETE operation: read "before" state
                JsonNode before = payload.get("before");
                Long id = before.get("event_id").asLong();
                searchRepo.deleteById(id);
            } else {
                // CREATE or UPDATE ("c", "u", "r"): read "after" state
                JsonNode after = payload.get("after");
                Event doc = new Event(
                        after.get("event_id").asLong(),
                        after.get("title").asText(),
                        after.get("description").asText(),
                        after.get("category").asText(),
                        after.get("language").asText(),
                        after.get("genre").asText(),
                        after.get("duration_mins").asInt(),
                        after.get("censor_rating").asText(),
                        parseDebeziumDate(after.get("release_date")),
                        after.hasNonNull("poster_url")?after.get("poster_url").asText():null,
                        after.hasNonNull("banner_url")?after.get("banner_url").asText():null,
                        after.hasNonNull("trailer_url")?after.get("trailer_url").asText():null,
                        after.get("is_active").asBoolean(),
                        parseDebeziumTimestamp(after.get("created_at")),
                        parseDebeziumTimestamp(after.get("updated_at"))




                );
                searchRepo.save(doc); // Upsert into Elasticsearch
            }
        } catch (Exception e) {
            // In production: send to Dead Letter Queue (DLQ)
            e.printStackTrace();
        }
    }

    private LocalDate parseDebeziumDate(JsonNode node) {
        if (node == null || node.isNull()) return null;
        if (node.isNumber()) {
            return LocalDate.ofEpochDay(node.asLong());
        }
        return LocalDate.parse(node.asText());
    }

    /**
     * Debezium io.debezium.time.MicroTimestamp represents microseconds since Epoch
     */
    private OffsetDateTime parseDebeziumTimestamp(JsonNode node) {
        if (node == null || node.isNull()) return null;
        if (node.isNumber()) {
            long epochMicros = node.asLong();
            long epochSeconds = epochMicros / 1_000_000L;
            long nanoAdjustment = (epochMicros % 1_000_000L) * 1_000L;
            return Instant.ofEpochSecond(epochSeconds, nanoAdjustment).atOffset(ZoneOffset.UTC);
        }
        return OffsetDateTime.parse(node.asText());
    }
}
