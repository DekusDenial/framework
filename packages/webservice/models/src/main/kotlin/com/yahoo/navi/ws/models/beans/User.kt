package com.yahoo.navi.ws.models.beans

import com.yahoo.elide.annotation.Include
import com.yahoo.elide.annotation.SharePermission
import com.yahoo.elide.annotation.DeletePermission
import com.yahoo.elide.annotation.CreatePermission
import com.yahoo.elide.annotation.UpdatePermission
import com.yahoo.elide.annotation.ReadPermission
import com.yahoo.elide.annotation.ComputedAttribute
import com.yahoo.navi.ws.models.utils.FormatDate

import org.hibernate.annotations.Generated
import org.hibernate.annotations.GenerationTime
import java.util.Date

import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Temporal
import javax.persistence.TemporalType
import javax.persistence.Transient

@Entity
@Table(name="navi_users")
@Include(rootLevel = true, type = "users")
@SharePermission(expression = "everybody")
@DeletePermission(expression = "nobody")
@CreatePermission(expression = "is the same user")
@UpdatePermission(expression = "is the same user now")
class User {
    @get:Id
    var id: String? = null

    @get:Generated(GenerationTime.INSERT)
    @get:Column(updatable = false, insertable = false, columnDefinition = "timestamp default current_timestamp")
    @get:Temporal(TemporalType.TIMESTAMP)
    @get:ReadPermission(expression = "nobody")
    @get:UpdatePermission(expression = "nobody")
    var createDate: Date? = null

    var createdOn: String? = null
        @Transient
        @ComputedAttribute
        get() = FormatDate.format(createDate)
}