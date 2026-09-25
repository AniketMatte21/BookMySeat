package com.search_service.Document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.lang.annotation.Documented;
import java.time.LocalDate;
import java.time.OffsetDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(indexName = "events")
public class Event {

    @Id
    @Field(type = FieldType.Long)
    private Long eventId;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String title;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @Field(type = FieldType.Keyword)
    private String category;

    @Field(type = FieldType.Keyword)
    private String language;

    @Field(type = FieldType.Keyword)
    private String genre;

    @Field(type = FieldType.Integer)
    private Integer durationMins;

    @Field(type = FieldType.Keyword)
    private String censorRating;

    @Field(type = FieldType.Date)
    private LocalDate releaseDate;

    @Field(type = FieldType.Keyword, index = false)
    private String posterUrl;

    @Field(type = FieldType.Keyword, index = false)
    private String bannerUrl;

    @Field(type = FieldType.Keyword, index = false)
    private String trailerUrl;

    @Field(type = FieldType.Boolean)
    private Boolean isActive;

    @Field(type = FieldType.Date)
    private OffsetDateTime createdAt;

    @Field(type = FieldType.Date)
    private OffsetDateTime updatedAt;
}