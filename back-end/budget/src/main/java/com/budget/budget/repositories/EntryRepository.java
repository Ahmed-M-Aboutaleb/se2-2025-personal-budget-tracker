package com.budget.budget.repositories;

import com.budget.budget.models.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EntryRepository extends JpaRepository<Entry, Integer> {
    @Query("SELECT e FROM Entry e JOIN FETCH e.account JOIN FETCH e.category")
    List<Entry> findAllWithAssociations();
}
