import com.intellij.jvm.dfa.analysis.dev.config.TaintConfig
import com.intellij.jvm.dfa.analysis.configurator.taint.rules.TaintRule

TaintConfig {
    method("com.ecommerce.backend.model.Product.builder") { _ -> { } }
}